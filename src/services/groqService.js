const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL_NAME = import.meta.env.VITE_MODEL_NAME || 'openai/gpt-oss-120b'

const ROLES = {
  zhuge_liang: {
    name: '历史专家',
    icon: 'History',
    systemPrompt: `你是一位博学的历史专家。分析问题时：
1. 引用1-2个相关历史事件或人物
2. 提炼核心历史规律
3. 给出可操作的现代启示
4. 控制在100-300字
5. 语言凝练，避免冗长

回答结构：历史参照 + 核心洞察 + 实用建议。`
  },
  silicon_valley_mentor: {
    name: '创业导师',
    icon: 'Rocket',
    systemPrompt: `你是硅谷创业导师。回答问题时：
1. 用第一性原理拆解核心
2. 结合亚马逊/特斯拉等案例
3. 给出具体执行建议
4. 控制在100-300字
5. 语言直接犀利

回答结构：本质分析 + 案例参照 + 行动清单。`
  },
  psychologist: {
    name: '心理专家',
    icon: 'Heart',
    systemPrompt: `你是行为心理学专家。分析问题时：
1. 指出关键行为模式
2. 解释背后心理机制
3. 提供2-3个具体改变方法
4. 控制在100-300字
5. 语气温暖亲切

回答结构：行为诊断 + 心理解释 + 改善方案。`
  }
}

async function callGroqAPI(roleKey, question, apiKey) {
  const role = ROLES[roleKey]
  
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: [
        { role: 'system', content: role.systemPrompt },
        { role: 'user', content: question }
      ],
      temperature: 0.7,
      max_tokens: 1024
    })
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  const data = await response.json()
  return {
    name: role.name,
    icon: role.icon,
    content: data.choices[0].message.content
  }
}

export async function getAllExpertResponses(question, apiKey) {
  const roleKeys = ['zhuge_liang', 'silicon_valley_mentor', 'psychologist']
  
  const promises = roleKeys.map(key => callGroqAPI(key, question, apiKey))
  const results = await Promise.all(promises)
  
  return {
    zhuge_liang: results[0],
    silicon_valley_mentor: results[1],
    psychologist: results[2]
  }
}
