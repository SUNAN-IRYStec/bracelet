#!/usr/bin/env python3
"""
文件整理脚本
功能：遍历源文件夹下所有子文件夹，将每个文件拷贝到输出文件夹中独立的新文件夹中
"""

from pathlib import Path
import shutil


def get_subfolders(source_dir: Path) -> list[Path]:
    """获取源文件夹下的所有子文件夹"""
    return sorted([f for f in source_dir.iterdir() if f.is_dir()])


def get_files_in_folder(folder: Path) -> list[Path]:
    """获取文件夹中的所有文件（按名称排序）"""
    return sorted([f for f in folder.iterdir() if f.is_file()])


def copy_file_to_output(
    source_file: Path,
    output_dir: Path,
    subfolder_name: str,
    index: int
) -> str:
    """
    将文件拷贝到输出文件夹中的独立文件夹

    返回新文件夹名称
    """
    new_folder_name = f"{subfolder_name}_{index:04d}"
    new_folder_path = output_dir / new_folder_name
    new_folder_path.mkdir(parents=True, exist_ok=True)

    new_filename = f"{new_folder_name}{source_file.suffix}"
    dst_file = new_folder_path / new_filename

    shutil.copy2(source_file, dst_file)

    return new_folder_name


def organize_files(source_dir: Path, output_dir: Path) -> None:
    """
    遍历源文件夹，将每个文件拷贝到输出文件夹中的独立文件夹

    Args:
        source_dir: 源文件夹路径
        output_dir: 输出文件夹路径
    """
    output_dir.mkdir(parents=True, exist_ok=True)

    subfolders = get_subfolders(source_dir)
    print(f"找到 {len(subfolders)} 个子文件夹: {[f.name for f in subfolders]}")

    for subfolder in subfolders:
        files = get_files_in_folder(subfolder)
        print(f"\n处理文件夹 '{subfolder.name}': {len(files)} 个文件")

        for idx, source_file in enumerate(files, start=1):
            new_folder_name = copy_file_to_output(
                source_file, output_dir, subfolder.name, idx
            )
            print(f"  {source_file.name} -> {new_folder_name}/{new_folder_name}{source_file.suffix}")

    print(f"\n完成！所有文件已整理到 {output_dir}")


if __name__ == "__main__":
    source_directory = Path("/mnt/ssd1/my_backup/photo/bracelet")
    output_directory = Path("/mnt/ssd1/my_backup/photo/bracelet/output")

    organize_files(source_directory, output_directory)
