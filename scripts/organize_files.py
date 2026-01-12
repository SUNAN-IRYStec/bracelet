#!/usr/bin/env python3
"""
文件整理脚本
功能：遍历源文件夹下所有子文件夹，将每个文件拷贝到输出文件夹中独立的新文件夹中
"""

import os
import shutil

def organize_files(source_dir, output_dir):
    """
    遍历源文件夹，将每个文件拷贝到输出文件夹中的独立文件夹
    
    Args:
        source_dir: 源文件夹路径
        output_dir: 输出文件夹路径
    """
    # 确保输出文件夹存在
    os.makedirs(output_dir, exist_ok=True)
    
    # 获取源文件夹下的所有子文件夹
    subfolders = [f for f in os.listdir(source_dir) 
                  if os.path.isdir(os.path.join(source_dir, f))]
    
    print(f"找到 {len(subfolders)} 个子文件夹: {subfolders}")
    
    for subfolder in sorted(subfolders):
        subfolder_path = os.path.join(source_dir, subfolder)
        
        # 获取子文件夹中的所有文件
        files = [f for f in os.listdir(subfolder_path) 
                 if os.path.isfile(os.path.join(subfolder_path, f))]
        
        print(f"\n处理文件夹 '{subfolder}': {len(files)} 个文件")
        
        # 按文件名排序以确保序号一致
        files.sort()
        
        for idx, filename in enumerate(files, start=1):
            # 创建新文件夹名: 子文件夹名_序号(4位数字)
            new_folder_name = f"{subfolder}_{idx:04d}"
            new_folder_path = os.path.join(output_dir, new_folder_name)
            
            # 创建新文件夹
            os.makedirs(new_folder_path, exist_ok=True)
            
            # 获取原文件的扩展名
            file_ext = os.path.splitext(filename)[1]
            
            # 新文件名与文件夹同名
            new_filename = f"{new_folder_name}{file_ext}"
            
            # 源文件路径和目标文件路径
            src_file = os.path.join(subfolder_path, filename)
            dst_file = os.path.join(new_folder_path, new_filename)
            
            # 拷贝文件
            shutil.copy2(src_file, dst_file)
            
            print(f"  {filename} -> {new_folder_name}/{new_filename}")
    
    print(f"\n完成！所有文件已整理到 {output_dir}")

if __name__ == "__main__":
    # 设置源文件夹和输出文件夹
    source_directory = "/mnt/ssd1/my_backup/photo/bracelet"
    output_directory = "/mnt/ssd1/my_backup/photo/bracelet/output"
    
    # 执行整理
    organize_files(source_directory, output_directory)
