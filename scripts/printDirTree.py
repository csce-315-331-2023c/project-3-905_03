import os


def find_target(startpath, target):
    if not os.path.isdir(startpath):
        return None

    if os.path.basename(startpath) == target:
        return startpath

    for root, dirs, files in os.walk(startpath):
        # Remove directories to be ignored so they are not traversed
        ignore_dirs = ['node_modules', '.git']
        for ignore in ignore_dirs:
            if ignore in dirs:
                dirs.remove(ignore)

        if target in dirs or target in files:
            return os.path.join(root, target)
    return None


def generate_tree(startpath):
    tree = ["Directory Tree:"]
    for root, dirs, files in os.walk(startpath):
        # Remove directories to be ignored so they are not traversed
        ignore_dirs = ['node_modules', '.git']
        for ignore in ignore_dirs:
            if ignore in dirs:
                dirs.remove(ignore)

        level = root.replace(startpath, '').count(os.sep)
        indent = ' ' * 2 * level
        tree.append(f"{indent}├── {os.path.basename(root)}/")
        sub_indent = ' ' * 2 * (level + 1)
        for f in files:
            tree.append(f"{sub_indent}├── {f}")

    tree_str = '\n'.join(tree)

    # Save to a .txt file
    with open('directory_tree.txt', 'w') as f:
        f.write(tree_str)

    return tree_str


current_dir = os.getcwd()
target_dir = input("Enter the root of the directory tree (e.g., front): ")

target_full_path = find_target(current_dir, target_dir)
if target_full_path:
    print(generate_tree(target_full_path))
    print("Directory tree has been saved to 'directory_tree.txt'.")
else:
    print(f"Target {target_dir} not found in '{current_dir}'.")
