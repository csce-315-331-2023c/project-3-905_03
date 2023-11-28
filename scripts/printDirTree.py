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
    output_dir = os.path.join(startpath, "scripts", "outputs")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Save to a .txt file in the specified output directory
    output_path = os.path.join(output_dir, 'directory_tree.txt')
    with open(output_path, 'w') as f:
        f.write(tree_str)

    return tree_str


current_dir = os.getcwd()
target_dir = input("Enter the root of the directory tree (default is project-3-905-03): ")
target_dir = target_dir.strip()

if not target_dir:
    target_dir = "project-3-905-03"

target_full_path = find_target(current_dir, target_dir)
if target_full_path:
    print(generate_tree(target_full_path))
    print(f"Directory tree has been saved to '{os.path.join(target_full_path, 'scripts', 'outputs', 'directory_tree.txt')}'.")
else:
    print(f"Target {target_dir} not found in '{current_dir}'.")
