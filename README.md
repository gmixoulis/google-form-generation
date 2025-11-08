# DEMANDS Google Forms Generator

Automated Google Forms creation tool for DEMANDS evaluation surveys using Google Apps Script.

## Project Overview

This project uses **Google Apps Script** to automatically create Google Forms from structured JSON specifications, allowing rapid form generation and customization.


---

## Features

- ✅ **Automated Form Generation**: Create complete Google Forms from JSON templates in seconds
- ✅ **Multiple Question Types**: Supports scales, checkboxes, multiple choice, dropdowns, grids, and text items
- ✅ **Section-Based Organization**: Organize questions into logical sections with page breaks
- ✅ **No Manual Configuration**: All form structure defined in JSON; no UI clicking needed
- ✅ **Reusable Templates**: Pre-built JSON templates for trainer and trainee surveys
- ✅ **Easy Customization**: Modify JSON to adjust titles, questions, options, and order

---

## File Structure

```
Test-Forms-Generator/
├── README.md                    # This file
├── src/
│   ├── main.gs                 # Main execution 
│   ├── formBuilder.gs          # Core form generation 
│   ├── trainerData.gs          # Trainer survey JSON & 
```

---

## Quick Start

### 1. Set Up Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Create a new project
3. Create four files: `main.gs`, `formBuilder.gs`, `trainerData.gs`
4. Copy the code from the project into each corresponding file

### 2. Run the Script

In the Apps Script editor:
- Select `createTrainerForm` from the function dropdown
- Click **Run**
- Authorize permissions when prompted
- Check the **Execution log** for the published form URL

Or run both forms at once:
```
createBothForms()
```

### 3. Share Your Form

Copy the published URL from the execution log and share with participants.

---

## Available Functions

### Main Execution Functions

#### `createTrainerForm()`
Generates the trainer evaluation survey form.
```
Output: Logs published URL of trainer form
```


#### `createBothForms()`
Generates both trainer and trainee forms in sequence.
```
Output: Logs both URLs to execution log
```

---

## JSON Form Specification

The form structure is defined in JSON using a "batchUpdate" style, where each question or section is a request object.

### Basic JSON Structure

```json
{
  "title": "Survey Title",
  "description": "Survey description",
  "requests": [
    {
      "createItem": {
        "item": {
          "title": "Question Title",
          "questionItem": {
            "question": {
              "required": true,
              "scaleQuestion": {
                "low": 1,
                "high": 5,
                "lowLabel": "Not at all",
                "highLabel": "Very much"
              }
            }
          }
        },
        "location": { "index": 0 }
      }
    }
  ]
}
```

### Supported Item Types

#### 1. **Page Break (Section)**
```json
{
  "pageBreakItem": {},
  "title": "Section Title",
  "description": "Section description"
}
```

#### 2. **Scale Question (1-5 rating)**
```json
{
  "questionItem": {
    "question": {
      "required": true,
      "scaleQuestion": {
        "low": 1,
        "high": 5,
        "lowLabel": "Not helpful",
        "highLabel": "Very helpful"
      }
    }
  },
  "title": "How helpful was this?"
}
```

#### 3. **Multiple Choice (Radio)**
```json
{
  "questionItem": {
    "question": {
      "required": true,
      "choiceQuestion": {
        "type": "RADIO",
        "options": [
          { "value": "Option 1" },
          { "value": "Option 2" },
          { "value": "Option 3" }
        ]
      }
    }
  },
  "title": "Select one option"
}
```

#### 4. **Checkbox (Multiple Select)**
```json
{
  "questionItem": {
    "question": {
      "required": true,
      "checkboxQuestion": {
        "options": [
          { "value": "Option A" },
          { "value": "Option B" },
          { "value": "Option C" }
        ]
      }
    }
  },
  "title": "Select all that apply"
}
```

#### 5. **Dropdown**
```json
{
  "questionItem": {
    "question": {
      "required": true,
      "choiceQuestion": {
        "type": "DROPDOWN",
        "options": [
          { "value": "Choice 1" },
          { "value": "Choice 2" }
        ]
      }
    }
  },
  "title": "Choose from dropdown"
}
```

#### 6. **Grid (Likert-style)**
```json
{
  "questionItem": {
    "question": {
      "required": true,
      "gridQuestion": {
        "rows": ["Row 1", "Row 2", "Row 3"],
        "columns": ["1", "2", "3", "4", "5"]
      }
    }
  },
  "title": "Rate each statement"
}
```

#### 7. **Short Text Answer**
```json
{
  "textItem": { "paragraph": false },
  "title": "Your name",
  "required": false
}
```

#### 8. **Paragraph Text (Long Answer)**
```json
{
  "textItem": { "paragraph": true },
  "title": "Your feedback",
  "required": false
}
```

---

## Customization Guide

### Change Form Title
In `trainerData.gs`, modify:
```javascript
"title": "Your New Title Here"
```

### Add or Remove Questions
In the `requests` array, add or remove question objects. Update `"location": { "index": X }` to maintain correct order.

### Modify Question Options
```json
"options": [
  { "value": "New Option 1" },
  { "value": "New Option 2" }
]
```

### Change Scale Range
```json
"scaleQuestion": {
  "low": 1,
  "high": 10,    // Change to different range
  "lowLabel": "Label",
  "highLabel": "Label"
}
```

### Make Question Required
```json
"required": true
```

---

## Current Forms Included

### 1. Trainer Evaluation Form
**File**: `trainerData.gs`  
**Sections**:
- Consent & Background
- Section A: Content Evaluation
- Section B: Training Delivery & Approaches
- Section C: Organization & Logistics
- Section D: Overall Impact & Future Application
- Section E: Open Comments & Additional Topics

**Questions**: 26 total
**Question Types**: Scale, checkbox, radio, paragraph 

## Troubleshooting

### Issue: "No requests in spec" Error
**Solution**: Ensure your JSON has a `"requests": [...]` array with at least one item.

### Issue: Form Created but No Questions Appear
**Solution**: Check that items have correct `"location": { "index": X }` values in order (0, 1, 2, ...).

### Issue: Question Type Not Recognized
**Solution**: Verify the `"question"` object has correct structure (e.g., `"scaleQuestion"`, `"checkboxQuestion"`, etc.).

### Issue: Published URL Not Appearing
**Solution**: Check the **Execution log** at the bottom of Apps Script editor for error messages.

---

## Advanced Usage

### Creating a New Form Template

1. Copy an existing data file (e.g., `trainerData.gs`)
2. Rename it (e.g., `customSurvey.gs`)
3. Update the JSON and function name
4. In `main.gs`, add a new execution function:
   ```javascript
   function createCustomForm() {
     const json = getCustomSurveyJson();
     const spec = JSON.parse(json);
     const url = createFormFromBatchUpdateSpec(spec);
     Logger.log('Custom Form URL: ' + url);
   }
   ```


## General Information Template

Use the `generalInfo.txt` file to add context to your form. Include it in the form `description` field:

```json
"description": "For VET trainers: Please evaluate your experience. [Include general info here...]"
```

---

## Support & Documentation

- **Google Apps Script Docs**: https://developers.google.com/apps-script
- **Forms Service**: https://developers.google.com/apps-script/reference/forms
- **Google Forms Help**: https://support.google.com/docs/answer/7322520

---

## Contributing

To extend this project:
1. Add new JSON templates in the `samples/` folder
2. Create corresponding `.gs` data files for new survey types
3. Update `main.gs` with new execution functions
4. Document changes in this README

