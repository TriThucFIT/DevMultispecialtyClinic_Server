import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { LabTestService } from './labTest.service';
import { ApiResponseDto } from 'src/Common/DTO/ApiResponse.dto';
import {
  LabTestCategoryResponseDTO,
  LabTestCreationDTO,
  LabTestResponseDTO,
} from './types';
import { plainToClass } from 'class-transformer';
import {
  LabRequestCreation,
  LabRequestResponseDto,
  TestResultResponseDto,
} from './types/labRequest.type';
import { TestResultCreationDto } from 'src/PatientModule/dto/patient.dto';
import { log } from 'console';
import { IsNotEmpty } from 'class-validator';

@Controller('labTest')
export class LabTestController {
  constructor(private readonly service: LabTestService) {}

  @Get()
  async findAll(): Promise<ApiResponseDto<LabTestCategoryResponseDTO[]>> {
    const labs = await this.service.findLabTestByCategory();
    return {
      data: plainToClass(LabTestCategoryResponseDTO, labs, {
        excludeExtraneousValues: true,
      }),
      message: 'Success',
      statusCode: 200,
    };
  }

  @Get('lab-request')
  async findResultOfLabRequest(
    @Query('labRequestId') id: number,
  ): Promise<ApiResponseDto<LabRequestResponseDto>> {
    if (!id) {
      throw new BadRequestException('Lab request id is required');
    }
    const labRequest = await this.service.findResultOfLabRequest(id);
    return {
      data: plainToClass(LabRequestResponseDto, labRequest, {
        excludeExtraneousValues: true,
      }),
      message: 'Success',
      statusCode: 200,
    };
  }

  @Post()
  async createLabTest(
    @Body() labTestCreation: LabTestCreationDTO,
  ): Promise<ApiResponseDto<LabTestResponseDTO>> {
    const lab = await this.service.createLabTest(labTestCreation);
    return {
      data: plainToClass(LabTestResponseDTO, lab, {
        excludeExtraneousValues: true,
      }),
      message: 'Success',
      statusCode: 200,
    };
  }

  @Post('request')
  async createLabRequest(
    @Body() request: LabRequestCreation,
  ): Promise<ApiResponseDto<LabRequestResponseDto[]>> {
    const labRequest = await this.service.createLabRequest(request);
    return {
      data: plainToClass(LabRequestResponseDto, labRequest, {
        excludeExtraneousValues: true,
      }),
      message: 'Success',
      statusCode: 200,
    };
  }

  @Post('result')
  async createTestResult(
    @Body() result: TestResultCreationDto,
  ): Promise<ApiResponseDto<TestResultResponseDto>> {
    const testResult = await this.service.createTestResult(result);
    return {
      data: plainToClass(TestResultResponseDto, testResult, {
        excludeExtraneousValues: true,
      }),
      message: 'Success',
      statusCode: 200,
    };
  }
}
