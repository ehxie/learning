" .vimrc 的注释需要用双引号

" Plug 插件管理
call plug#begin('~/.vim/plugged')
" 状态栏：显示 vim 当前模式
Plug 'itchyny/lightline.vim'
" 搜索
Plug 'Yggdroot/LeaderF', { 'do': ':LeaderfInstallCExtension' }
" 用起来比 LeaderF 好用
Plug 'justinmk/vim-sneak'
" 注释
Plug 'preservim/nerdcommenter'
" 代码提示(需要 Node > 16.18.0)
" Plug 'neoclide/coc.nvim', {'branch': 'release'}
call plug#end()

"" 前缀键：<leader>
let mapleader = " "
" 设置行号 可以输出 `:set nu` `:set nonu` 进行快速变化(只在当前输入的文件生效)
" set nu
" 使用相对行号
" set relativenumber
" 使用系统剪切板 -> Vim
" set clipboard=unnamedplus
" Vim -> 系统剪切板
set clipboard=unnamed
" 修复切换模式时的延迟
set ttimeout ttimeoutlen=10
" 撤销操作，ctrl+r
set undofile
" 记住最近一百次操作
set history=100
" 突出显示当前行
" set cursorline
" 拼写检查
" set spell! spellang=en_us
" 使用 jj 代替 esc 退出 insert 模式(只在 insert 模式下生效)
imap jj <Esc>


" lightline 配置
" 不生效请参考：https://github.com/itchyny/lightline.vim#introduction
set laststatus=2

" Leaderf Config
" LeaderF 弹出框在中间
let g:Lf_WindowPosition = "popup"
" 搜索时忽略的文件或目录
let g:Lf_WildIgnore={'file':[],'dir':['node_modules', 'Application Support']}
" 显示隐藏文件
let g:Lf_ShowHidden = 1

" nerdcommenter
" 注释后面加一个空格
let g:NERDSpaceDelims = 1

