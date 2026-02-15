import Model from '@/models/Model';
import Konselors, { IncomingApiData } from '@/models/Konselors';
import { describe, expect, it } from 'vitest';

describe('Konselors', () => {
  it('should be a valid model', () => {
    expect(Konselors).toBeDefined();
    expect(Konselors.prototype).toBeDefined();
    expect(Konselors.prototype.constructor).toBeDefined();
    expect(Konselors.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.konselors).toBe(Konselors);
  });

  it('should be able to create a new Konselors', () => {
    const konselors = new Konselors(1, 'Malik');

    expect(konselors).toBeDefined();
    expect(konselors.id).toBe(1);
    expect(konselors.name).toBe('Malik');
  });

  it('should be able to create a new Konselors from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const konselors = Konselors.fromApiData(apiData);

    expect(konselors).toBeDefined();
    expect(konselors.id).toBe(apiData.id);
    expect(konselors.name).toBe(apiData.name);
  });

  it('should be able to create a new Konselors array from API data array', () => {
    const apiData: IncomingApiData[] = [
      {
        id: 1,
        name: 'Rapik'
      },
      {
        id: 2,
        name: 'Aqshal'
      }
    ];
    const konselorses = Konselors.fromApiData(apiData);

    expect(konselorses).toBeDefined();
    expect(konselorses.length).toBe(apiData.length);
    expect(konselorses[0].id).toBe(apiData[0].id);
    expect(konselorses[0].name).toBe(apiData[0].name);
    expect(konselorses[1].id).toBe(apiData[1].id);
    expect(konselorses[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Konselors to API data', () => {
    const konselors = new Konselors(1, 'Malik');
    const apiData = Konselors.toApiData(konselors);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(konselors.id);
    expect(apiData.name).toBe(konselors.name);
  });

  it('should be able to convert Konselors array to API data array', () => {
    const konselorses = [new Konselors(1, 'Malik'), new Konselors(2, 'Fauzan')];
    const apiData = Konselors.toApiData(konselorses);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(konselorses.length);
    expect(apiData[0].id).toBe(konselorses[0].id);
    expect(apiData[0].name).toBe(konselorses[0].name);
    expect(apiData[1].id).toBe(konselorses[1].id);
    expect(apiData[1].name).toBe(konselorses[1].name);
  });
});
