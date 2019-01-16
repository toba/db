import '@toba/test';
import { MockAsyncStorage } from './__mocks__/mock-async-storage';

beforeAll(() => {
   jest.mock('AsyncStorage', () => new MockAsyncStorage());
});

afterAll(() => {
   jest.unmock('AsyncStorage');
});

test('', () => {});
