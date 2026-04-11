import type { Dispatch, SetStateAction } from 'react';
import type { SectionItem } from '../shared/types';
import { randomIconIndex } from './teamIcons';

export function addItem(
  list: SectionItem[],
  setList: Dispatch<SetStateAction<SectionItem[]>>,
): void {
  const newItem: SectionItem = {
    id: Date.now(),
    text: '',
    iconIndex: randomIconIndex(),
  };
  setList([...list, newItem]);
}

export function removeItem(
  list: SectionItem[],
  setList: Dispatch<SetStateAction<SectionItem[]>>,
  id: number,
): void {
  setList(list.filter((item) => item.id !== id));
}

export function updateItem(
  list: SectionItem[],
  setList: Dispatch<SetStateAction<SectionItem[]>>,
  id: number,
  field: string,
  value: string,
): void {
  setList(list.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
}
