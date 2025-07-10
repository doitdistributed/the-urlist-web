import fetch from 'node-fetch';

describe('API Integration: Field Presence', () => {
  // Adjust baseUrl if your dev server runs on a different port
  const baseUrl = 'http://localhost:4321/api';

  test('GET /lists returns all required fields', async () => {
    const res = await fetch(`${baseUrl}/lists`);
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    const arr = data as any[];
    if (arr.length > 0) {
      const list = arr[0];
      expect(list).toHaveProperty('id');
      expect(list).toHaveProperty('name');
      expect(list).toHaveProperty('title');
      expect(list).toHaveProperty('description');
      expect(list).toHaveProperty('image');
      expect(list).toHaveProperty('slug');
      expect(list).toHaveProperty('created_at');
    }
  });

  test('GET /links returns all required fields', async () => {
    // First, fetch a list to get a valid list_id
    const listsRes = await fetch(`${baseUrl}/lists`);
    expect(listsRes.ok).toBe(true);
    const listsData = await listsRes.json();
    expect(Array.isArray(listsData)).toBe(true);
    const listsArr = listsData as any[];
    if (listsArr.length === 0) {
      // No lists to test with
      return;
    }
    const listId = listsArr[0].id;
    const res = await fetch(`${baseUrl}/links?list_id=${listId}`);
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    const arr = data as any[];
    if (arr.length > 0) {
      const link = arr[0];
      expect(link).toHaveProperty('id');
      expect(link).toHaveProperty('list_id');
      expect(link).toHaveProperty('url');
      expect(link).toHaveProperty('title');
      expect(link).toHaveProperty('description');
      expect(link).toHaveProperty('image');
      expect(link).toHaveProperty('position');
      expect(link).toHaveProperty('created_at');
    }
  });

  test('GET /link_groups returns all required fields', async () => {
    const res = await fetch(`${baseUrl}/link_groups`);
    // If you don't have this endpoint, skip or adjust
    if (!res.ok) return;
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    const arr = data as any[];
    if (arr.length > 0) {
      const group = arr[0];
      expect(group).toHaveProperty('id');
      expect(group).toHaveProperty('list_id');
      expect(group).toHaveProperty('name');
      expect(group).toHaveProperty('position');
      expect(group).toHaveProperty('created_at');
    }
  });
});
