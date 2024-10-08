import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { LoginService } from 'src/app/login.service';
import { Produto } from 'src/app/models/Produto.model';
import { ProdutoService } from 'src/app/produto.service';

@Component({
  selector: 'app-lista-produto',
  templateUrl: './lista-produto.component.html',
  styleUrls: ['./lista-produto.component.css']
})

export class ListaProdutoComponent implements OnInit{

  public produtos: Produto[] = [];
  public produto: Produto = new Produto(0, '', '', '', 0);

  constructor(private _produtoService:ProdutoService, private _router: Router,
    private _loginService:LoginService){}

  ngOnInit(): void {
    this.listarProdutos();
    this._loginService.setMostraMenu(false);
  }

  listarProdutos():void{
    this._produtoService.getProdutos().subscribe(
      retornaProduto =>{
        this.produtos = retornaProduto.map(
          item => {
            return new Produto(
              item.id,
              item.produto,
              item.descricao,
              item.foto,
              item.preco
            );
          }
        )
      }
    )
  }

  excluir(id: number){
    this._produtoService.removerProduto(id).pipe(
      tap(
        vaga => {
          this.listarProdutos();
        }
      ), 
      catchError(err => {
        alert("Erro ao excluir");
        return of (null);
      })).subscribe(()=>{
        this._router.navigate(["/restrito/lista"])
      }) 
}}
