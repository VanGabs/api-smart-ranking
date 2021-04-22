import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import {CriarJogadorDto} from './dtos/criar-jogador.dto';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';

@Controller('api/v1/jogadores')
export class JogadoresController {

    constructor(private readonly jogadoresService: JogadoresService) {}

    @Post()
    async criarAtualizarJogador(@Body() criarJogadorDto: CriarJogadorDto) {
        await this.jogadoresService.criarAtualizarJogador(criarJogadorDto);
    }

    @Get()
    async consultarJogadores(@Query('email') email: string):Promise<Jogador[]> {
        if(email) {
            await this.jogadoresService.consultaJogadorPorEmail(email);
        }
        return await this.jogadoresService.consultarJogadores();
    }

    @Delete()
    async deletaJogador(@Query('email') email: string): Promise<void> {
        return await this.jogadoresService.deletaJogador(email);
    }
}
