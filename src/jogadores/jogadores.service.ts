import { Injectable, Logger } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4} from 'uuid';

@Injectable()
export class JogadoresService {

    private readonly logger = new Logger(JogadoresService.name);
    private jogadores: Jogador[] = [];

    async criarAtualizarJogador(criaJogadorDto: CriarJogadorDto): Promise<void> {
        this.criar(criaJogadorDto);
    }

    private criar(criaJogadorDto: CriarJogadorDto): void {
        const { nome , telefoneCelular, email } = criaJogadorDto

        const jogador:Jogador = {
            id: uuidv4() ,
            nome, 
            telefoneCelular,
            email,
            ranking: "A",
            posição: 1,
            urlFotoJogador: "www.google.com.br/foto123.jpg"
        };
        this.logger.log(`criaJogadorDto: ${JSON.stringify(jogador)}`)
        this.jogadores.push(jogador);
    }
}
