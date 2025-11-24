
export const translations = {
  en: {
    nav: {
      features: "Features",
      faq: "Q&A"
    },
    hero: {
      badge: "AI-Powered Video Workflow",
      title: "ClipFlow",
      subtitle: "Transform messy Douyin/TikTok links into polished, rewritten scripts in seconds. The ultimate tool for cross-border e-commerce content creators.",
      cta: "Start Creating"
    },
    source: {
      title: "Workspace",
      pasteLabel: "Paste Link",
      pastePlaceholder: "Paste Douyin share text (e.g. '1.20 WmD:/...')",
      or: "OR",
      uploadBtn: "Upload Video File",
      uploadHint: "MP4/MOV supported",
      fileSelected: "File Selected:",
      changeFile: "Change",
      startBtn: "Start Processing",
      resetBtn: "Reset",
      processing: {
        fetching: "Fetching...",
        extracting: "Extracting...",
        transcribing: "Transcribing...",
        default: "Processing..."
      }
    },
    preview: {
      title: "Source Video",
      engine: "Engine:"
    },
    transcript: {
      title: "Original Transcript",
      detected: "AI Detected",
      placeholder: "Extracted text will appear here..."
    },
    rewrite: {
      title: "AI Script Rewriter",
      inputPlaceholder: "Enter instructions (e.g. Make it sell harder...)",
      btn: "Generate Script",
      outputPlaceholder: "Your new script will appear here...",
      defaultInstruction: "Rewrite this script to be more engaging for a US audience, focusing on the product benefits."
    },
    features: {
      title: "Why Choose ClipFlow?",
      items: [
        {
          title: "One-Click Extraction",
          desc: "Instantly parse Douyin links, remove watermarks, and extract core content."
        },
        {
          title: "Smart Transcription",
          desc: "Powered by advanced ASR models to convert speech to text with high accuracy."
        },
        {
          title: "AI Rewriting",
          desc: "Use Gemini to reshape tone, style, and length for different platforms."
        },
        {
          title: "Cross-Border Ready",
          desc: "Optimized for e-commerce practitioners moving content between regions."
        }
      ]
    },
    faq: {
      title: "Common Questions",
      items: [
        {
          q: "Is this tool free to use?",
          a: "Currently, ClipFlow is in beta and free for personal use."
        },
        {
          q: "What video formats are supported?",
          a: "We support standard MP4 and MOV files up to 100MB."
        },
        {
          q: "Can I translate the script to English directly?",
          a: "Yes! Just ask the AI Rewriter to 'Translate to English' in the instruction box."
        }
      ]
    },
    footer: {
      design: "Designed by Gemini 3",
      power: "Powered by borderX"
    },
    errors: {
      noLink: "No valid URL found.",
      noFile: "Please provide a link or file.",
      downloadFail: "Video download failed.",
      generic: "Error occurred."
    }
  },
  zh: {
    nav: {
      features: "功能特点",
      faq: "常见问题"
    },
    hero: {
      badge: "AI 驱动的视频工作流",
      title: "ClipFlow",
      subtitle: "将杂乱的抖音链接秒变精美的短视频脚本。跨境电商、内容创作者的必备效率工具。",
      cta: "立即开始"
    },
    source: {
      title: "工作台",
      pasteLabel: "粘贴链接",
      pastePlaceholder: "粘贴抖音分享文案 (如 '1.20 WmD:/...')",
      or: "或者",
      uploadBtn: "上传视频文件",
      uploadHint: "支持 MP4/MOV",
      fileSelected: "已选文件：",
      changeFile: "更换",
      startBtn: "开始处理",
      resetBtn: "重置",
      processing: {
        fetching: "获取中...",
        extracting: "提取中...",
        transcribing: "转写中...",
        default: "处理中..."
      }
    },
    preview: {
      title: "源视频",
      engine: "引擎："
    },
    transcript: {
      title: "原始文案",
      detected: "AI 识别",
      placeholder: "提取的字幕将显示在这里..."
    },
    rewrite: {
      title: "AI 改写助手",
      inputPlaceholder: "输入指令 (例如：让语气更带货一点...)",
      btn: "生成新脚本",
      outputPlaceholder: "改写后的脚本将显示在这里...",
      defaultInstruction: "将这段文案改写得更具吸引力，重点突出产品痛点解决，语气要活泼。"
    },
    features: {
      title: "核心功能",
      items: [
        {
          title: "一键提取",
          desc: "智能解析抖音分享链接，自动去除水印并提取视频核心内容。"
        },
        {
          title: "精准转写",
          desc: "内置 FunASR 级语音识别能力，将视频语音精准转换为可编辑文本。"
        },
        {
          title: "自主改写",
          desc: "利用大模型能力，根据您的指令调整文案风格、语种和长短。"
        },
        {
          title: "跨境优选",
          desc: "专为跨境电商打造，轻松将国内爆款视频转化为海外适用脚本。"
        }
      ]
    },
    faq: {
      title: "常见问题",
      items: [
        {
          q: "这个工具收费吗？",
          a: "目前 ClipFlow 处于公测阶段，个人用户可免费使用。"
        },
        {
          q: "支持哪些视频格式？",
          a: "支持常见的 MP4 和 MOV 格式，最大支持 100MB。"
        },
        {
          q: "可以直接翻译成英文吗？",
          a: "当然可以！只需要在改写指令框中输入“翻译成地道的英文脚本”即可。"
        }
      ]
    },
    footer: {
      design: "Design by Gemini 3",
      power: "Powered by borderX"
    },
    errors: {
      noLink: "未找到有效链接。",
      noFile: "请提供链接或文件。",
      downloadFail: "视频下载失败。",
      generic: "发生未知错误。"
    }
  }
};
