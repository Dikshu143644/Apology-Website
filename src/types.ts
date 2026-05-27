/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MemoryItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface PromiseItem {
  id: number;
  text: string;
  icon: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  image: string;
  category?: string;
}

export interface Butterfly {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  wingAngle: number;
  flapSpeed: number;
  targetX?: number;
  targetY?: number;
  phase: number;
}
