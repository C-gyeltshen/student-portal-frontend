# CSV Upload Feature - Finance Officer Dashboard

## Overview
The Finance Officer Dashboard now includes a complete CSV upload and preview feature that allows users to upload CSV files, view their contents, and prepare them for import (future functionality).

## Features Implemented

### 1. File Upload Interface
- **Upload Button**: Styled blue button with upload icon
- **File Validation**: Only accepts `.csv` files
- **Sample Template**: Download link for sample CSV format
- **File Selection Display**: Shows filename and file size

### 2. CSV Processing
- **FileReader API**: Reads CSV files client-side
- **CSV Parsing**: Simple parser that splits by newlines and commas
- **Data Storage**: Stores parsed CSV data in component state
- **Processing Indicator**: Shows spinner during file processing

### 3. Cancel Functionality
- Clears selected file
- Resets CSV preview data
- Resets file input element
- Returns UI to initial state

### 4. CSV Preview Display
- **Full Table View**: Displays all CSV data in a formatted table
- **Header Row**: First row treated as column headers
- **Styled Table**: Alternating row colors, hover effects
- **Info Card**: Shows row and column count
- **Close Button**: Removes preview and resets state

## Usage Instructions

### For Users

1. **Upload a CSV File**
   - Click the "Upload CSV" button in the top-right corner
   - Select a CSV file from your computer
   - Only `.csv` files are accepted

2. **Download Sample Template**
   - Click "Download sample CSV template" link
   - Use this as a reference for proper CSV format

3. **Preview Your Data**
   - After selecting a file, click "Proceed"
   - Wait for the processing spinner to complete
   - View your data in the preview table

4. **Cancel/Reset**
   - Click "Cancel" to reset before processing
   - Click "Close Preview" to clear the preview and start over

### Sample CSV Format

Location: `/public/sample.csv`

```csv
student_id,name,stipend_amount,deduction
11901234,Tshering Dorji,15000,500
11901235,Karma Wangmo,15000,0
11901236,Pema Lhamo,12000,1000
11901237,Sonam Tenzin,15000,250
11901238,Kinley Dem,10000,750
```

**Columns:**
- `student_id`: Student identification number
- `name`: Full name of the student
- `stipend_amount`: Amount of stipend allocated
- `deduction`: Any deductions from the stipend

## Technical Implementation

### State Management

```typescript
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [csvData, setCsvData] = useState<string[][] | null>(null);
const [isProcessing, setIsProcessing] = useState(false);
```

### Key Functions

#### `handleFileChange()`
- Validates file type (must be `.csv`)
- Sets selected file in state
- Shows alert if invalid file type

#### `handleCancelFile()`
- Clears selected file
- Clears CSV preview data
- Resets processing state
- Resets file input element

#### `handleProceed()`
- Uses FileReader to read the file
- Parses CSV into 2D array (rows and columns)
- Stores parsed data in state
- Shows processing spinner during operation
- Handles errors gracefully

### CSV Parsing Logic

```typescript
const rows = text.split('\n').filter(row => row.trim() !== '');
const parsedData = rows.map(row => {
  return row.split(',').map(cell => cell.trim());
});
```

**Note:** This is a simple parser. For production, consider using a library like `papaparse` for more robust CSV parsing (handles quotes, escaping, etc.).

## UI Components

### 1. Upload Section (Initial State)
```
┌─────────────────────────────────┐
│ [Upload CSV] Import student data│
│ Download sample CSV template    │
└─────────────────────────────────┘
```

### 2. File Selected State
```
┌─────────────────────────────────┐
│ 📄 sample.csv (1.23 KB)         │
│ [Cancel] [Proceed]              │
└─────────────────────────────────┘
```

### 3. CSV Preview
```
┌─────────────────────────────────────────┐
│ CSV Preview                [Close Preview]│
│ 5 rows • 4 columns                      │
├─────────────────────────────────────────┤
│ student_id │ name          │ ...         │
│ 11901234   │ Tshering Dorji│ ...         │
│ 11901235   │ Karma Wangmo  │ ...         │
│ ...        │ ...           │ ...         │
└─────────────────────────────────────────┘
```

## Styling Details

### Colors & Theme
- **Upload Button**: Blue (`bg-blue-600`)
- **Cancel Button**: Gray (`bg-gray-100`)
- **Proceed Button**: Green (`bg-green-600`)
- **Close Button**: Red (`bg-red-600`)
- **Preview Header**: Green gradient (`from-green-50 to-emerald-50`)

### Responsive Design
- Mobile-friendly layout
- Horizontal scroll for wide tables
- Hover effects on all interactive elements

## Future Enhancements

### Backend Integration
Replace the placeholder in `handleProceed()` with actual API calls:

```typescript
const handleProceed = async () => {
  if (!selectedFile) return;
  
  const formData = new FormData();
  formData.append('file', selectedFile);
  
  try {
    const response = await fetch('/api/upload-csv', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    // Handle response
  } catch (error) {
    // Handle error
  }
};
```

### Validation
- Validate CSV structure matches expected format
- Check for required columns
- Validate data types (e.g., student_id is numeric)
- Show validation errors to user

### Data Import
- Map CSV columns to database fields
- Bulk insert students into database
- Handle duplicate student IDs
- Show success/failure summary

### Advanced Features
- Column mapping interface (drag & drop)
- Data transformation options
- Progress bar for large files
- Undo/rollback functionality
- Import history and logs

## File Structure

```
src/app/finance-officer/
  └── page.tsx (Main component with CSV feature)

public/
  └── sample.csv (Sample CSV template)

Documentation:
  └── CSV_UPLOAD_FEATURE.md (This file)
```

## Testing

### Test Cases

1. **Upload Valid CSV**
   - Select sample.csv
   - Click Proceed
   - Verify table displays correctly

2. **Upload Invalid File**
   - Try to upload .txt or .xlsx
   - Verify error message appears

3. **Cancel Before Processing**
   - Select file
   - Click Cancel
   - Verify UI resets

4. **Cancel After Preview**
   - Process a CSV
   - Click "Close Preview"
   - Verify all state clears

5. **Large CSV**
   - Test with 100+ row CSV
   - Verify performance

6. **Empty CSV**
   - Upload empty file
   - Verify graceful handling

7. **Malformed CSV**
   - Upload CSV with inconsistent columns
   - Verify parsing or error handling

## API Endpoints (Future)

### POST /api/upload-csv
**Request:**
```typescript
{
  file: File // CSV file
}
```

**Response:**
```typescript
{
  success: boolean,
  message: string,
  imported: number,
  failed: number,
  errors?: Array<{
    row: number,
    error: string
  }>
}
```

## Icons Used

- `Upload` - Upload button
- `FileText` - File display and preview header
- `X` - Cancel and close buttons
- `CheckCircle` - Proceed button

## Notes

- **Client-Side Only**: Currently all CSV processing happens in the browser
- **No Data Persistence**: Data is not saved anywhere (placeholder feature)
- **Simple Parser**: Basic CSV parsing - doesn't handle quoted fields with commas
- **Memory Considerations**: Large CSV files load entirely into memory

## Troubleshooting

### Issue: File won't upload
- Check file extension is `.csv`
- Verify file is not corrupted
- Check browser console for errors

### Issue: Preview looks wrong
- Ensure CSV uses commas as delimiters
- Check for proper line endings (LF or CRLF)
- Verify no special characters

### Issue: Processing takes too long
- Large files may take time to parse
- Consider adding file size limit
- Show progress indicator

## Resources

- [FileReader API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
- [CSV Format Specification](https://tools.ietf.org/html/rfc4180)
- [PapaParse Library](https://www.papaparse.com/) - For production CSV parsing

---

**Last Updated**: November 27, 2025  
**Version**: 1.0.0  
**Status**: ✅ Complete (Placeholder Feature)
