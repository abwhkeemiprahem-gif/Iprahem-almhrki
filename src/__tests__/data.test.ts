import { describe, it, expect } from 'vitest';
import { 
  PROJECTS_DATA, 
  filterProjectsByCategory, 
  searchProjectsByQuery, 
  sortProjectsByTitle 
} from '../data';

describe('Project list filter and sort utilities', () => {
  it('should return all projects when filter is set to "all"', () => {
    const filtered = filterProjectsByCategory(PROJECTS_DATA, 'all');
    expect(filtered).toHaveLength(PROJECTS_DATA.length);
  });

  it('should correctly filter projects by "sovereign" category', () => {
    const filtered = filterProjectsByCategory(PROJECTS_DATA, 'sovereign');
    expect(filtered.some(p => p.id === 'siyaj-system')).toBe(true);
    expect(filtered.some(p => p.id === 'letter-journey')).toBe(false);
  });

  it('should correctly filter projects by "edu" category', () => {
    const filtered = filterProjectsByCategory(PROJECTS_DATA, 'edu');
    expect(filtered.some(p => p.id === 'letter-journey')).toBe(true);
  });

  it('should correctly search projects by query keyword', () => {
    const searched = searchProjectsByQuery(PROJECTS_DATA, 'siyaj');
    expect(searched.length).toBeGreaterThan(0);
    expect(searched[0].id).toBe('siyaj-system');
  });

  it('should return empty list when search query does not match anything', () => {
    const searched = searchProjectsByQuery(PROJECTS_DATA, 'unmatched-nonsense-search-term');
    expect(searched).toHaveLength(0);
  });

  it('should correctly sort projects by title alphabetically', () => {
    const sortedAsc = sortProjectsByTitle(PROJECTS_DATA, 'asc');
    const sortedDesc = sortProjectsByTitle(PROJECTS_DATA, 'desc');
    
    expect(sortedAsc.length).toBe(PROJECTS_DATA.length);
    expect(sortedDesc.length).toBe(PROJECTS_DATA.length);
  });
});
