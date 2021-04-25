import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {

    private readonly logger = new Logger(JogadoresService.name);
    
    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) {}

    async criarAtualizarJogador(criaJogadorDto: CriarJogadorDto): Promise<void> {
        const { email } = criaJogadorDto        
        const jogadorEncontrado = await this.jogadorModel.findOne({email}).exec();

        if (jogadorEncontrado) {
            await this.atualizarJogadores(criaJogadorDto);
        }

        try {
            this.criar(criaJogadorDto);
        } catch (error) {
            throw new RpcException('Não foi possivel criar o Jogador');
        }
    }
    
    async consultarJogadores():Promise<Jogador[]> {
        return await this.jogadorModel.find().exec();
    }
    
    async consultaJogadorPorEmail(email: string): Promise<Jogador> {
        const jogadorEncontrado = await this.jogadorModel.findOne({email: email}).exec();

        if (!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com email ${email} não foi`);
        } 
        
        return jogadorEncontrado;
    }

    async deletaJogador(email: string): Promise<void> {
        const jogadorEncontrado =  await this.jogadorModel.findOne({email: email}).exec();
        
        if(!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com email ${email} não existe`);
        }
        
        this.logger.log('Jogador Deletado: ', `criaJogadorDto: ${JSON.stringify(jogadorEncontrado)}`)
        return await this.jogadorModel.remove({email}).exec();
    }

    private async criar(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
        const jogadorCriado = new this.jogadorModel(criaJogadorDto);
        
        this.logger.log('Jogador Criado: ', `criaJogadorDto: ${JSON.stringify(jogadorCriado)}`)
        return await jogadorCriado.save();

    }

    private async atualizarJogadores(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
        return await this.jogadorModel.findOneAndUpdate({email: criarJogadorDto.email},{$set: criarJogadorDto}).exec();
    }
}
