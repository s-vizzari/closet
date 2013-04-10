/*globals require, window, jasmine, describe, it, beforeEach, afterEach, expect, spyOn, fixtures, Factory */
describe('Closet', function() {

  var Closet = require('closet'),
      storage, storageType, testData;

  var storesToTest = ['NativeStore'];

  if (Closet.hasLocalStorage()) {
    storesToTest.push('LocalStore');
  }

  storesToTest.forEach(function(currentlyTesting) {

    describe('using ' + currentlyTesting + ',', function() {

      beforeEach(function() {
        storage = new Closet[currentlyTesting]();
        storage.clear();

        testData = {
          string: 'feather bed',
          number: 123456,
          object: { id: 123, name: 'pumpkin' }
        };
      });

      it('should return an instance of ' + currentlyTesting, function() {
        expect(storage).toBeInstanceOf(Closet[currentlyTesting]);
      });

      describe('#setItem and #getItem', function() {

        it('should handle a string', function() {
          storage.setItem('test', testData.string);
          expect(storage.getItem('test')).toEqual(testData.string);
        });

        it('should handle an object', function() {
          storage.setItem('test', testData.object);
          expect(storage.getItem('test')).toEqual(testData.object);
        });

        it('should handle a number', function() {
          storage.setItem('test', testData.number);
          expect(storage.getItem('test')).toEqual(testData.number);
        });

      });

      describe('edge case for #getItem', function() {

        it('should return null for a key that has not been set', function() {
          expect(storage.getItem('notSet')).toBeNull();
        });

        it('should return null for a key set to undefined', function() {
          storage.setItem('setToUndefined', undefined);
          expect(storage.getItem('setToUndefined')).toBeNull();
        });

        it('should return null for a key set to null', function() {
          storage.setItem('setToNull', null);
          expect(storage.getItem('setToNull')).toBeNull();
        });

      });

      describe('#removeItem', function() {

        it('should remove an individual item', function() {
          storage.setItem('keep', 'doNotDelete');
          storage.setItem('toss', 'delete');
          storage.removeItem('toss');
          expect(storage.getItem('keep')).toEqual('doNotDelete');
          expect(storage.getItem('toss')).toBeNull();
        });

      });

      describe('#clear', function() {

        it('should be able to clear the storage', function() {
          storage.setItem('test', testData.object);
          storage.setItem('anotherTest', 123456);
          storage.clear();
          expect(storage.getItem('test')).toBeNull();
          expect(storage.getItem('anotherTest')).toBeNull();
        });

      });

      describe('#keys', function() {

        it('should return an array of all stored keys', function() {
          storage.setItem('abc', 1);
          storage.setItem('bcd', 2);
          storage.setItem('cde', 3);
          expect(storage.length).toEqual(3);
          expect(storage.keys()).toContain('abc');
          expect(storage.keys()).toContain('bcd');
          expect(storage.keys()).toContain('cde');
        });

        it('should return an array of all stored keys that match a regular expression', function() {
          storage.setItem('abc', 1);
          storage.setItem('bcd', 2);
          storage.setItem('cde', 3);
          expect(storage.length).toEqual(3);
          expect(storage.keys('bc')).toContain('abc');
          expect(storage.keys('bc')).toContain('bcd');
          expect(storage.keys('bc')).not.toContain('cde');
        });

      });

      describe('length', function() {

        it('should increase when a new item is added to the data store', function() {
          expect(storage.length).toEqual(0);
          storage.setItem('test', testData.object);
          expect(storage.length).toEqual(1);
        });

        it('should not increase when an existing item is updated in the data store', function() {
          expect(storage.length).toEqual(0);
          storage.setItem('test', testData.object);
          expect(storage.length).toEqual(1);
          storage.setItem('test', testData.string);
          expect(storage.length).toEqual(1);
        });

        it('should by zero when the data store is cleared', function() {
          storage.setItem('test', testData.object);
          expect(storage.length).toEqual(1);
          storage.clear();
          expect(storage.length).toEqual(0);
        });

      });

      afterEach(function() {
        storage.clear();
      });

    });
  });
});
