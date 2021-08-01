import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JogadoresRepository } from './jogadores.repository';

@Injectable()
export class JogadoresService
{
    private readonly logger = new Logger(JogadoresService.name);

    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>, private readonly jogadoresRepository:JogadoresRepository) {}

    async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void>
    {
       return await this.jogadoresRepository.criarAtualizarJogador(criarJogadorDto);
    }
    
    async consultarJogadores(): Promise<Jogador[]>
    {
        return await this.jogadorModel.find().exec();
    }
    
    async consultaJogadorPorEmail(email: string): Promise<Jogador>
    {
        const jogadorEncontrado = await this.jogadorModel.findOne({email: email}).exec();
        
        if (!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com email ${email} não foi encontrado`);
        } 

        return jogadorEncontrado;
    }

    async deletaJogador(email: string): Promise<void>
    {
        const jogadorEncontrado =  await this.jogadorModel.findOne({email: email}).exec();
        
        if(!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com email ${email} não existe`);
        }
        
        this.logger.log('Jogador Deletado: ', `criaJogadorDto: ${JSON.stringify(jogadorEncontrado)}`)
        return await this.jogadorModel.remove({email}).exec();
    }
}
