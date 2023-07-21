import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@nestjs/common';
import { PokeRespone } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;
 
  async executeSeed(){
    const {data} = await this.axios.get<PokeRespone>('https://pokeapi.co/api/v2/pokemon?limit=650')
    data.results.forEach(({name, url})=> {
      const segmets = url.split('/')
      const no: number = +segmets[segmets.length - 2]
      
    })
    return data
  }
}
