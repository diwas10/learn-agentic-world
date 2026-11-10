import rawCurriculum from './curriculum.json';
import { CurriculumData } from '../types/curriculum';

export const curriculum: CurriculumData = rawCurriculum as unknown as CurriculumData;

export function getAllLessons() {
  const lessons: { moduleIndex: number; lessonIndex: number; module: any; lesson: any }[] = [];
  curriculum.modules.forEach((mod, mIdx) => {
    mod.lessons.forEach((les, lIdx) => {
      lessons.push({
        moduleIndex: mIdx,
        lessonIndex: lIdx,
        module: mod,
        lesson: les,
      });
    });
  });
  return lessons;
}
