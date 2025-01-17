import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';


// ADD TODO BASED ON USER ID
// FIND ALL BASED ON USER ID (NOT COMPLETED)
// FIND ALL COMPLETED TODOS BASED ON USER ID (COMPLETED)
// MARK TODO AS COMPLETED BASED ON TODO ID
// DELETE TODO BASED ON TODO ID


@Injectable()
export class TodoService {

  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>, private userService : UserService
  ) {}

  async create(createTodoDto: CreateTodoDto, userId : number) {
    let todo : Todo = new Todo();
    todo.title = createTodoDto.title;
    todo.date = new Date().toLocaleString();
    todo.completed = false;
    todo.user = await this.userService.findUserById(userId);
    return this.todoRepository.save(todo);
  }

  findAllTodoByUserNotCompleted(userId : number) {
   return this.todoRepository.find({
    relations: ['user'],
    where: { user: { id : userId}, completed : false},
   }) ;
  }

 findAllTodoByUserCompleted(userId : number) {
  return this.todoRepository.find({
    relations: ['user'],
    where: {user: {id : userId}, completed: true},
  })
 }

  update(todoId: number) {
    return this.todoRepository.update(todoId, { completed: true});
  }

  remove(todoId: number) {
    return this.todoRepository.delete(todoId);
  }
}
