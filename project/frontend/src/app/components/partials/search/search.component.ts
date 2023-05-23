import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  searched = '';

  constructor(activatedRoute: ActivatedRoute, private router: Router){
    activatedRoute.params.subscribe((params => {
      if(params.searched)
        this.searched = params.searched;
    }));
  }  

  search(term: string): void{
    if(term)
      this.router.navigateByUrl('/search/' + term);
  }

}
