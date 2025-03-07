import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StreamsComponent} from './streams.component';
import {DestroyComponent} from './destroy/destroy.component';
import {UndeployComponent} from './undeploy/undeploy.component';
import {SecurityServiceMock} from '../../tests/api/security.service.mock';
import {AboutServiceMock} from '../../tests/api/about.service.mock';
import {NotificationServiceMock} from '../../tests/service/notification.service.mock';
import {StreamServiceMock} from '../../tests/api/stream.service.mock';
import {By} from '@angular/platform-browser';
import {GrafanaStreamDirective, GrafanaStreamsDirective} from '../../shared/grafana/grafana.directive';
import {GrafanaServiceMock} from '../../tests/service/grafana.service.mock';
import {GroupServiceMock} from '../../tests/service/group.service.mock';
import {ContextServiceMock} from '../../tests/service/context.service.mock';
import {SettingsServiceMock} from '../../tests/service/settings.service.mock';
import {DatagridColumnPipe} from '../../shared/pipe/datagrid-column.pipe';
import {TranslateTestingModule} from 'ngx-translate-testing';
import TRANSLATIONS from '../../../assets/i18n/en.json';
import {throwError} from 'rxjs';
import {AppError} from '../../shared/model/error.model';

describe('streams/streams/streams.component.ts', () => {
  let component: StreamsComponent;
  let fixture: ComponentFixture<StreamsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        StreamsComponent,
        DestroyComponent,
        UndeployComponent,
        GrafanaStreamsDirective,
        GrafanaStreamDirective,
        DatagridColumnPipe
      ],
      imports: [
        FormsModule,
        ClarityModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
        TranslateTestingModule.withTranslations('en', TRANSLATIONS)
      ],
      providers: [
        SecurityServiceMock.provider,
        AboutServiceMock.provider,
        NotificationServiceMock.provider,
        StreamServiceMock.provider,
        GrafanaServiceMock.provider,
        GroupServiceMock.provider,
        ContextServiceMock.provider,
        SettingsServiceMock.provider
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamsComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the datagrid, pagination, action bar', async () => {
    component.timeSubscription = <any>{}; // hack to disable setting the timer, otherwise it times out
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const datagrid = fixture.debugElement.query(By.css('clr-datagrid')).nativeElement;
    const pagination = fixture.debugElement.query(By.css('clr-dg-pagination')).nativeElement;
    const actionBar = fixture.debugElement.query(By.css('clr-dg-action-bar')).nativeElement;
    const rows = fixture.debugElement.queryAll(By.css('clr-dg-row'));
    const cols = fixture.debugElement.queryAll(By.css('clr-dg-column'));
    const title = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(datagrid).toBeTruthy();
    expect(pagination).toBeTruthy();
    expect(actionBar).toBeTruthy();
    expect(title.textContent).toContain('Streams');
    expect(rows.length === 4).toBeTruthy();
    expect(cols.length === 4).toBeTruthy();
  });

  it('should catch API error and display a message', async () => {
    spyOn(StreamServiceMock.mock, 'getStreams').and.callFake(() => throwError(new AppError('Fake error')));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    expect(NotificationServiceMock.mock.errorNotification[0].message.toString()).toBe('Fake error');
  });
});
