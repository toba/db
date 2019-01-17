import '@toba/test';
import 'react-native';
import { MockAsyncStorage } from './__mocks__/mock-async-storage';

// https://github.com/devmetal/mock-async-storage#usage

beforeAll(() => {
   jest.mock('AsyncStorage', () => new MockAsyncStorage());
});

afterAll(() => {
   jest.unmock('AsyncStorage');
});

import { AsyncStorage as storage } from 'react-native';

test('dummy', () => {
   expect('three').toBe('three');
   expect(storage).toBeDefined();
});
