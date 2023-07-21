import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error)
    }
   
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if(!isNaN(+term)){
      console.log('term')
      pokemon = await this.pokemonModel.findOne({no: term})
    }

    if(isValidObjectId(term)){
     
      pokemon = await this.pokemonModel.findById(term)
    }
    
    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name: term})
    }


    if(!pokemon) throw new NotFoundException('Pokemon with id, name or no not found')
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      
    const pokemon = await this.findOne(term)
    
    if(updatePokemonDto.name){
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      await pokemon.updateOne(updatePokemonDto);
      return {...pokemon.toJSON(), ...updatePokemonDto}
    }
    return pokemon;
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    const result = await this.pokemonModel.deleteOne({_id: id})
    if(result.deletedCount === 0) throw new BadRequestException(`Pokemon with ${id} not found`)
    return result;
  }

  private handleExceptions(error : any){
    if(error.code == 11000) throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`)
      console.log(error);
    throw new InternalServerErrorException(`Can't update pokemon - Check logs`)
  }
}
