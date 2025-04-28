import { LocalDateToDatePipe } from './local-date-to-date.pipe';

describe('LocalDateToDatePipe', () => {
  it('create an instance', () => {
    const pipe = new LocalDateToDatePipe();
    expect(pipe).toBeTruthy();
  });
});
