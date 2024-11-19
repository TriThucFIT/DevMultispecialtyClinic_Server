import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { Casher } from '../entities/casher.entity';
import { CasherService } from '../services/Casher.service';
import { InvoiceService } from '../services/Invoice.service';
import { Roles } from 'src/Decorators/roles.decorator';
import { Action, Resource, RoleName } from 'src/Common/Enums/auth.enum';
import { Permissions } from 'src/Decorators/permissions.decorator';
import { HttpExceptionFilter } from 'src/Common/DTO/HandleException';
import { ApiTags } from '@nestjs/swagger';
import { InvoiceCreationDTO, InvoiceResponseDTO, InvoiceUpdateItemsRequest, PayInvoiceRequest } from '../types/invoice';
import { ApiResponseDto } from 'src/Common/DTO/ApiResponse.dto';

@Controller('casher')
@ApiTags('casher')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(HttpExceptionFilter)
export class CasherController {
  constructor(
    private readonly casherService: CasherService,
    private readonly invoiceService: InvoiceService,
  ) {}

  @Get()
  async findAll(): Promise<Casher[]> {
    return this.casherService.findAll();
  }

  @Get('invoices')
  @Roles(RoleName.Casher)
  @Permissions([
    {
      resource: Resource.Invoice,
      actions: [Action.Read],
    },
  ])
  async findByPatientInfo(
    @Query('phone') phone: string,
    @Query('fullName') fullName: string,
    @Query('email') email: string,
    @Query('patient_id') patientId: string,
  ): Promise<ApiResponseDto<InvoiceResponseDTO[]>> {
    try {
      const data = await this.invoiceService.findByPatientInfo(
        phone,
        fullName,
        email,
        patientId,
      );
      return {
        data,
        message: 'Thành công',
        statusCode: HttpStatus.OK,
      };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post('invoices/pay')
  @Roles(RoleName.Casher)
  @Permissions([
    {
      resource: Resource.Invoice,
      actions: [Action.Update],
    },
  ])
  async payInvoice(
    @Request() req : any,
    @Body() payInvoiceRequest: PayInvoiceRequest,
  ): Promise<ApiResponseDto<InvoiceResponseDTO>> {
    try {
      payInvoiceRequest.casher_username = req.user.username;
      const data = await this.invoiceService.payInvoice(payInvoiceRequest);
      return {
        data,
        message: 'Thanh toán hóa đơn thành công',
        statusCode: HttpStatus.OK,
      };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post('invoices/add')
  @Roles(RoleName.Casher, RoleName.Admin)
  @Permissions([
    {
      resource: Resource.Invoice,
      actions: [Action.Update],
    },
  ])
  async addInvoiceItem(
    @Body() invoice: InvoiceUpdateItemsRequest,
  ): Promise<ApiResponseDto<InvoiceResponseDTO>> {
    try {
      const data = await this.invoiceService.addInvoiceItem(invoice);
      return {
        data,
        message: 'Thêm vào hóa đơn thành công',
        statusCode: HttpStatus.OK,
      };
    } catch (e) {
      throw e;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Casher> {
    return this.casherService.findOne(id);
  }

  @Post()
  async create(@Body() casher: Casher): Promise<Casher> {
    return this.casherService.create(casher);
  }
}
