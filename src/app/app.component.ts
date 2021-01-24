import { Component } from '@angular/core';

import { GithubDataService } from '@app/core/services/github-data.service';
import { Observable } from 'rxjs';
import { Theme } from '@app/shared/models/themes.interface';

@Component({
  selector: 'tr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isAuth$: Observable<boolean> = this.githubDataService.isAuth;

  // THEME
  activeThemeClass: string;
  themes: Array<Theme> = [
    {
      key: 'light',
      isActive: false,
      materialIcon: 'brightness_5'
    },
    {
      key: 'default',
      isActive: true,
      materialIcon: 'format_color_reset'
    },
    {
      key: 'dark',
      isActive: false,
      materialIcon: 'brightness_2'
    },
  ];

  constructor(private githubDataService: GithubDataService) {

  }

  onSelectTheme = (theme: Theme) => {
    if (!theme) {
      return;
    }
    this.themes = this.themes.map(t => ({
      ...t,
      isActive: t.key === theme.key
    }));
    this.setThemeClass(theme.key);
  };

  setThemeClass = (themeKey: string) => {
    this.activeThemeClass = themeKey ? `theme--${ themeKey }` : null;
  };

}
