import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Casher } from '../entities/casher.entity';
import { CasherService } from '../services/Casher.service';

@Controller('casher')
export class CasherController {
  constructor(private readonly casherService: CasherService) {}

  @Get()
  async findAll(): Promise<Casher[]> {
    return this.casherService.findAll();
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