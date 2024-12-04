import { Injectable } from '@nestjs/common';
import { TestResultData } from './TestResult.data';
import { log } from 'console';

@Injectable()
export class GenerateTestResult {
  async generateTestResult(request: string) {
    log("request", request);

    const labTest = TestResultData.labResults?.find(
      (item) => item.name === request,
    );
    log(labTest);
    const randomResult =
      labTest.testResults[
        Math.floor(Math.random() * labTest.testResults.length)
      ];

      log("randomResult", randomResult);
    return randomResult;
  }
}
