import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并 CSS 类名的工具函数
 * 支持 clsx 的所有功能，并使用 tailwind-merge 去重和解决冲突
 * 与 class-variance-authority 完美集成
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}