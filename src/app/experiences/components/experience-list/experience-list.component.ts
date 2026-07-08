import { Component, OnInit } from '@angular/core';
import { ExperiencesApiService } from '../../services/experiences-api.service';
import { ExperienceResource } from '../../model/experience.resource';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experience-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience-list.component.html',
  styleUrls: ['./experience-list.component.scss']
})
export class ExperienceListComponent implements OnInit {
  experiences: ExperienceResource[] = [];

  constructor(private experiencesApi: ExperiencesApiService) { }

  ngOnInit(): void {
    // this.experiencesApi.getAllExperiences().subscribe(data => {
    //   this.experiences = data;
    // });
  }
}
