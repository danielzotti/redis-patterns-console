import { NgModule, Optional, SkipSelf, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { ConfigService } from './services/config.service';
import { CacheInterceptor } from './interceptors/cache-interceptor';
import { HeaderComponent } from '@app/core/components/header/header.component';
import { ThemeSelectorComponent } from '../shared/components/theme-selector/theme-selector.component';

@NgModule({
  declarations: [
    HeaderComponent,
    ThemeSelectorComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule
  ],
  exports: [
    HeaderComponent,
    ThemeSelectorComponent
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: ConfigService) => {
        return () => configService.init();
      },
      deps: [ ConfigService ],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true
    }
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
