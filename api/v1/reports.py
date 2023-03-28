from datetime import datetime
from queue import Empty
from pylon.core.tools import log
from flask_restful import Resource
from flask import request


class API(Resource):
    url_params = [
        '<int:project_id>',
    ]

    def __init__(self, module):
        self.module = module

    def get(self, project_id: int):
        result = {}

        exclude_fields = (
            'project_name', 'description', 'urls_to_scan', 'urls_exclusions', 'scan_location', 'test_config'
        )

        if start_time := request.args.get('start_time'):
            start_time = datetime.fromisoformat(start_time.strip('Z'))

        security_plugins = ['application', ]
        for plugin in security_plugins:
            try:
                reports = self.module.context.rpc_manager.call_function_with_timeout(
                    func=f'{plugin}_security_results_dast',
                    timeout=3,
                    project_id=project_id,
                    start_date=start_time,
                )
                unique_test_results = self.module.context.rpc_manager.call_function_with_timeout(
                    func=f'{plugin}_security_results_dast',
                    timeout=3,
                    project_id=project_id,
                    start_date=start_time,
                    unique=True
                )
                result[plugin] = {
                    "health": self.get_health(unique_test_results),
                    "report_type": plugin,
                    "reports": [{**report.to_json(exclude_fields)} for report in reports]
                }
            except Empty:
                ...

        return result

    @staticmethod
    def get_health(test_results):
        AMBER_THRESHOLD = 0.6
        GREEN_THRESHOLD = 0.8
        GREY_THRESHOLD = 0.5

        succeeded_tests = 0
        finished_tests = 0

        all_tests = len(test_results)

        for report in test_results:
            log.info(f"{report.test_status=}")
            if report.test_status["status"].lower() == 'finished':
                finished_tests += 1
            elif report.test_status["status"].lower() == 'success':
                succeeded_tests += 1

        log.info(f"{succeeded_tests=}, {finished_tests=}, {all_tests=}")

        if (finished_tests >= all_tests * GREY_THRESHOLD) or not all_tests:
            return 'grey'

        all_tests -= finished_tests
        if (succeeded_tests / all_tests) >= GREEN_THRESHOLD:
            return 'green'
        elif (succeeded_tests / all_tests) >= AMBER_THRESHOLD:
            return 'amber'
        else:
            return 'red'
