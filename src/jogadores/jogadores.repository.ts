import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Jogador } from './interfaces/jogador.interface';
import { Model } from 'mongoose';
import { CriarJogadorDto } from "./dtos/criar-jogador.dto";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class JogadoresRepository
{
    private readonly logger = new Logger(JogadoresRepository.name);

    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) {}

    async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void>
    {
        const { email } = criarJogadorDto        
        const jogadorEncontrado = await this.jogadorModel.findOne({email}).exec();

        if (jogadorEncontrado) {
            try {
                await this.atualizarJogadores(criarJogadorDto);
            } catch (error) {
                throw new RpcException('Não foi possivel atualizar o jogador')
            }
        } else {
            try {
                await this.criar(criarJogadorDto);
            } catch (error) {
                throw new RpcException('Não foi possivel criar o Jogador');
            }
        } 
    }

    private async criar(criarJogadorDto: CriarJogadorDto): Promise<Jogador>
    {
        const jogadorCriado = new this.jogadorModel(criarJogadorDto);
        
        this.logger.log('Jogador Criado: ', `criaJogadorDto: ${JSON.stringify(jogadorCriado)}`)
        return await jogadorCriado.save();

    }

    private async atualizarJogadores(criarJogadorDto: CriarJogadorDto): Promise<Jogador>
    {
        return await this.jogadorModel.findOneAndUpdate({email: criarJogadorDto.email},
            {$set: criarJogadorDto}).exec()
    }
}
