import { Module } from '@nestjs/common';
import { JogadoresController } from './jogadores.controller';
import { JogadoresService } from './jogadores.service';
import { MongooseModule} from '@nestjs/mongoose'
import { JogadorSchema } from './interfaces/jogador.schema';
import { JogadoresRepository } from './jogadores.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Jogador', schema: JogadorSchema }])],
  controllers: [JogadoresController],
  providers: [JogadoresService, JogadoresRepository]
})
export class JogadoresModule {}
