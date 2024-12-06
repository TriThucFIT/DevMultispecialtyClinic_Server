import { Injectable } from '@nestjs/common';
import { TestResultData } from './TestResult.data';

@Injectable()
export class GenerateTestResult {
  async generateTestResult(request: string) {
    const labTest = TestResultData.labResults?.find(
      (item) => item.name === request,
    );
    const randomResult =
      labTest.testResults[
        Math.floor(Math.random() * labTest.testResults.length)
      ];
    return randomResult;
  }
}
