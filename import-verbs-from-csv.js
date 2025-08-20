#!/usr/bin/env node

// Script to import verbs from CSV file and add them to the compressed dutch-verbs.json
// This allows you to easily add 200+ verbs using a spreadsheet
// Note: Future tense conjugations are dynamically generated and not stored in the JSON

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  result.push(current);
  return result;
}

function convertCSVToCompressedVerb(csvRow) {
  // CSV column order based on our export
  // Note: Future tense is not included as it's dynamically generated using "zullen + infinitive"
  const [
    infinitive, english, stem, level, is_separable, is_irregular,
    present_ik, present_jij, present_hij_zij, present_wij, present_jullie, present_zij,
    past_ik, past_jij, past_hij_zij, past_wij, past_jullie, past_zij,
    perfect_ik, perfect_jij, perfect_hij_zij, perfect_wij, perfect_jullie, perfect_zij
  ] = csvRow;

  return {
    "i": infinitive,
    "e": english,
    "s": stem,
    "l": level,
    "sp": is_separable === 'true',
    "ir": is_irregular === 'true',
    "t": {
      "pr": {
        "c": {
          "ik": present_ik,
          "jij": present_jij,
          "hij/zij": present_hij_zij,
          "wij": present_wij,
          "jullie": present_jullie,
          "zij": present_zij
        }
      },
      "pa": {
        "c": {
          "ik": past_ik,
          "jij": past_jij,
          "hij/zij": past_hij_zij,
          "wij": past_wij,
          "jullie": past_jullie,
          "zij": past_zij
        }
      },
      "pe": {
        "c": {
          "ik": perfect_ik,
          "jij": perfect_jij,
          "hij/zij": perfect_hij_zij,
          "wij": perfect_wij,
          "jullie": perfect_jullie,
          "zij": perfect_zij
        }
      }
    }
  };
}

function importVerbsFromCSV(csvFileName = 'dutch-verbs-export.csv', startFromRow = 2) {
  try {
    console.log(`📖 Reading CSV file: ${csvFileName}`);
    
    const csvPath = path.join(__dirname, csvFileName);
    if (!fs.existsSync(csvPath)) {
      console.error(`❌ CSV file not found: ${csvPath}`);
      process.exit(1);
    }
    
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    console.log(`📄 Found ${lines.length} lines in CSV (including header)`);
    
    // Skip header and any rows before startFromRow
    const dataLines = lines.slice(startFromRow - 1);
    console.log(`🔄 Processing ${dataLines.length} verb rows (starting from row ${startFromRow})`);
    
    // Parse CSV and convert to compressed format
    const newVerbs = [];
    let skippedCount = 0;
    
    dataLines.forEach((line, index) => {
      const actualRowNumber = index + startFromRow;
      try {
        const csvRow = parseCSVLine(line);
        
        // Skip empty rows or rows with empty infinitive
        if (!csvRow[0] || csvRow[0].trim() === '') {
          console.log(`⏭️  Skipping empty row ${actualRowNumber}`);
          skippedCount++;
          return;
        }
        
        const compressedVerb = convertCSVToCompressedVerb(csvRow);
        newVerbs.push(compressedVerb);
        
        if (newVerbs.length <= 5) {
          console.log(`✓ Row ${actualRowNumber}: ${csvRow[0]} (${csvRow[1]}) - ${csvRow[3]}`);
        }
        
      } catch (error) {
        console.error(`❌ Error processing row ${actualRowNumber}: ${error.message}`);
        skippedCount++;
      }
    });
    
    if (newVerbs.length > 5) {
      console.log(`  ... and ${newVerbs.length - 5} more verbs`);
    }
    
    if (skippedCount > 0) {
      console.log(`⚠️  Skipped ${skippedCount} invalid rows`);
    }
    
    if (newVerbs.length === 0) {
      console.log('❌ No valid verbs found to import');
      process.exit(1);
    }
    
    // Read current verb data
    console.log('📚 Reading current verb database...');
    const verbFilePath = path.join(__dirname, 'src/data/dutch-verbs.json');
    const currentData = JSON.parse(fs.readFileSync(verbFilePath, 'utf8'));
    
    const originalCount = currentData.v.length;
    console.log(`📊 Current database has ${originalCount} verbs`);
    
    // Add new verbs
    currentData.v.push(...newVerbs);
    
    // Create backup first
    const backupPath = verbFilePath + '.backup-' + new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    fs.writeFileSync(backupPath, JSON.stringify(currentData, null, 2));
    console.log(`💾 Created backup: ${path.basename(backupPath)}`);
    
    // Write updated data
    fs.writeFileSync(verbFilePath, JSON.stringify(currentData));
    
    console.log('✅ Import completed successfully!');
    console.log(`📊 Added ${newVerbs.length} new verbs`);
    console.log(`📊 Total verbs now: ${currentData.v.length} (was ${originalCount})`);
    
    // Show some stats
    const levelCounts = {};
    newVerbs.forEach(verb => {
      levelCounts[verb.l] = (levelCounts[verb.l] || 0) + 1;
    });
    
    console.log('\n📈 Added verbs by level:');
    Object.entries(levelCounts).forEach(([level, count]) => {
      console.log(`   ${level}: ${count} verbs`);
    });
    
  } catch (error) {
    console.error('❌ Error importing verbs from CSV:', error.message);
    process.exit(1);
  }
}

// Command line usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const csvFile = process.argv[2] || 'dutch-verbs-export.csv';
  const startRow = parseInt(process.argv[3]) || 2; // Default to row 2 (skip header)
  
  console.log('🚀 CSV to Verb Import Tool');
  console.log(`📄 CSV File: ${csvFile}`);
  console.log(`📍 Starting from row: ${startRow}`);
  console.log('');
  
  importVerbsFromCSV(csvFile, startRow);
}

export { importVerbsFromCSV, convertCSVToCompressedVerb };
