import os
import json
import glob
import frontmatter

CONTENT_DIR = "content"
OUTPUT_FILE = "app/src/data/modules.json"

def build_content():
    modules = []
    
    # Get all markdown files sorted by name (01_..., 02_...)
    files = sorted(glob.glob(os.path.join(CONTENT_DIR, "*.md")))
    
    for file_path in files:
        print(f"Processing {file_path}...")
        with open(file_path, "r") as f:
            post = frontmatter.load(f)
            
            module_data = {
                "id": post.get("id"),
                "title": post.get("title"),
                "icon": post.get("icon"),
                "analogy": post.get("analogy"),
                "contentMarkdown": post.content,
                "codeSnippet": post.get("code_snippet"),
                "codeLanguage": post.get("code_language")
            }
            modules.append(module_data)
            
    # Ensure output directory exists
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    
    with open(OUTPUT_FILE, "w") as f:
        json.dump(modules, f, indent=2)
    
    print(f"Successfully wrote {len(modules)} modules to {OUTPUT_FILE}")

if __name__ == "__main__":
    build_content()
