def html_asset_inject(index_html, action_factory, injector, assets):
  output = action_factory.declare_file("index.html")
  args = action_factory.args()
  args.add(output.path)
  args.add(index_html.path)
  args.add_all([f.path for f in assets])
  args.use_param_file("%s", use_always=True)
  action_factory.run(
    inputs = [index_html],
    outputs = [output],
    executable = injector,
    arguments = [args],
  )
  return output

def move_files(files, action_factory, assembler):
  www_dir = action_factory.declare_directory("www") # FIXME magic string, how does the user know?
  args = action_factory.args()
  args.add(www_dir.path)
  args.add_all([f.path for f in files])
  args.use_param_file("%s", use_always=True)
  action_factory.run(
    inputs = files,
    outputs = [www_dir],
    executable = assembler,
    arguments = [args],
    execution_requirements = {"local": "1"},
  )
  return depset([www_dir])

def _web_package(ctx):
  populated_index = html_asset_inject(ctx.file.index_html, ctx.actions, ctx.executable._injector, ctx.files.assets)
  package_layout = move_files(ctx.files.data + ctx.files.assets + [populated_index], ctx.actions, ctx.executable._assembler)
  return [
    DefaultInfo(files = package_layout)
  ]


web_package = rule(
  implementation = _web_package,
  attrs = {
    "assets": attr.label_list(allow_files=True),
    "data": attr.label_list(allow_files = True),
    "index_html": attr.label(allow_single_file=True),
    "_assembler": attr.label(
      default = "//tools:assembler",
      executable = True,
      cfg = "host",
      ),
    "_injector": attr.label(
      default = "//tools:injector",
      executable = True,
      cfg = "host",
      ),
  }
)