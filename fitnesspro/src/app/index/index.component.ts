import { Component, OnInit } from '@angular/core';

declare var $:any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    
      $("#feedControl").empty();
      $('#feedControl').FeedEk({
            FeedUrl : 'https://www.sciencedaily.com/rss/health_medicine/fitness.xml',
            MaxCount: 10,
            DateFormat: 'MM/DD/YYYY',
            DateFormatLang: 'id'
        })
  }

}
