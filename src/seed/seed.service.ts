
import { Injectable } from '@nestjs/common';
import { PokeRespone } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ){}
 
  async executeSeed(){
    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeRespone>('https://pokeapi.co/api/v2/pokemon?limit=650')

    // const inserPromisesArray = [];

    // data.results.forEach(({name, url})=> {
    //   const segmets = url.split('/')
    //   const no: number = +segmets[segmets.length - 2]

    //   // const pokemon = await this.pokemonModel.create({name, no})
    //   inserPromisesArray.push(
    //     this.pokemonModel.create({name, no})
    //   )

    // })
    // await Promise.all(inserPromisesArray);
    // return 'Seed Executed'

    const pokemonToInsert:{name:string, no:number}[] = [];

    data.results.forEach(({name, url})=> {
      const segmets = url.split('/')
      const no: number = +segmets[segmets.length - 2]

      // const pokemon = await this.pokemonModel.create({name, no})
      pokemonToInsert.push({name, no})
      

    })
    await this.pokemonModel.insertMany(pokemonToInsert)
    return 'Seed Executed'
  }
}
