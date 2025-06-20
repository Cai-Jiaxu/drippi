// pages/api/categories.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

// match your JSON fixture shape
type RawCategory = { pk: number; fields: { name: string } }
// the shape your UploadPage expects
export type Category = { id: number; name: string }

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Category[]>
) {
  //  └─ point this at your django/core/fixtures/categories.json
  const jsonPath = path.join(
    process.cwd(),
    '../django/core/fixtures/categories.json'
  )

  const file = fs.readFileSync(jsonPath, 'utf8')
  const raw: RawCategory[] = JSON.parse(file)

  // Do the for-loop transform here:
  const cats: Category[] = []
  for (const item of raw) {
    cats.push({
      id: item.pk,
      name: item.fields.name,
    })
  }

  return res.status(200).json(cats)
}
