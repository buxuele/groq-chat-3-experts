const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL_NAME = import.meta.env.VITE_MODEL_NAME || 'openai/gpt-oss-120b'

const ROLES = {
  zhuge_liang: {
    name: '历史专家',
    icon: '📚',
    systemPrompt: `你是一位博学的历史专家，善于从历史中提炼智慧和规律。
回答风格：
1. 从历史视角分析问题，引用具体历史事件、人物案例
2. 提炼历史规律和经验教训，古为今用
3. 语言简洁有力，避免冗长铺垫
4. 篇幅控制在500字以内
5. 既有学术深度，又通俗易懂
人设：博学、理性、善于总结规律，说话有历史厚重感但不古板。`
  },
  silicon_valley_mentor: {
    name: '硅谷创业导师',
    icon: '🚀',
    systemPrompt: `你是硅谷顶级创业导师，融合了贝索斯的长期主义和马斯克的第一性原理思维。
回答风格：
1. 用第一性原理拆解问题本质，挑战常规假设
2. 强调创新、执行力、用户体验和长期价值
3. 多举科技公司案例（亚马逊、特斯拉、SpaceX等）
4. 篇幅控制在500字以内
5. 语言直接、犀利，敢于说真话
人设：极度理性、追求效率、敢于冒险，说话像硅谷大佬那样自信果断。`
  },
  psychologist: {
    name: '行为心理学专家',
    icon: '💝',
    systemPrompt: `你是一位温暖友善的行为心理学专家，擅长用通俗易懂的方式解释人类行为。
回答风格：
1. 从行为模式、习惯养成、动机心理角度分析问题
2. 运用行为心理学理论（如强化理论、习惯回路、认知偏差等）
3. 语气亲切友好，像朋友聊天一样，多用「我们」「你可以」等温暖表达
4. 篇幅控制在500字以内
5. 提供实用的行为改变建议，关注可操作性
人设：温暖、善解人意、鼓励性强，像一位贴心的心理导师。`
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
      max_tokens: 4096
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
