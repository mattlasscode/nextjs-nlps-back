import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileName = file.name || '';
    const fileType = fileName.split('.').pop()?.toLowerCase();
    let records;

    if (fileType === 'json') {
      try {
        const text = Buffer.from(arrayBuffer).toString('utf-8');
        records = JSON.parse(text);
        if (!Array.isArray(records)) {
          return NextResponse.json({ error: 'JSON must be an array of listings' }, { status: 400 });
        }
      } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON file' }, { status: 400 });
      }
    } else if (fileType === 'csv') {
      try {
        const text = Buffer.from(arrayBuffer).toString('utf-8');
        records = parse(text, { columns: true, skip_empty_lines: true });
      } catch (e) {
        return NextResponse.json({ error: 'Invalid CSV file' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    // Validate required fields
    const requiredFields = ['title', 'description', 'price', 'location', 'bedrooms', 'bathrooms', 'squareFeet', 'propertyType', 'images'];
    const invalidRecords = [];
    const validRecords = [];
    for (const [i, rec] of records.entries()) {
      const missing = requiredFields.filter(f => !(f in rec) || rec[f] === undefined || rec[f] === '');
      if (missing.length > 0) {
        invalidRecords.push({ index: i, missing });
      } else {
        validRecords.push(rec);
      }
    }

    return NextResponse.json({
      success: true,
      validCount: validRecords.length,
      invalidCount: invalidRecords.length,
      invalidRecords,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error', details: String(error) }, { status: 500 });
  }
} 