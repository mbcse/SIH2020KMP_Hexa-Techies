import webbrowser
import json
import boto3
import io
from io import BytesIO
import sys
from pprint import pprint
import pdf2image
import os
import csv
import shutil

def extract_jpg(file_name,csv_output_file):
    table_csv = get_table_csv_results(file_name)
    with open(csv_output_file, "w") as fout:
        fout.write(table_csv)
    
    #print('CSV OUTPUT FILE: ',csv_output_file)
    
def extract_pdf(file_name,csv_output_file):    
    from pdf2image import convert_from_path
    pages = convert_from_path(file_name, 500)
    table_csv=""
    for page in pages:
        page.save('out.jpeg', 'JPEG')
        table_csv+= get_table_csv_results('out.jpeg')
        os.remove("out.jpeg")
         
    with open(csv_output_file, "w") as fout:
        fout.write(table_csv)
        
    #print('CSV OUTPUT FILE: ',csv_output_file)
    
    
def get_rows_columns_map(table_result, blocks_map):
    rows = {}
    for relationship in table_result['Relationships']:
        if relationship['Type'] == 'CHILD':
            for child_id in relationship['Ids']:
                cell = blocks_map[child_id]
                if cell['BlockType'] == 'CELL':
                    row_index = cell['RowIndex']
                    col_index = cell['ColumnIndex']
                    if row_index not in rows:
                        # create new row
                        rows[row_index] = {}
                        
                    # get the text value
                    rows[row_index][col_index] = get_text(cell, blocks_map)
    return rows


def get_text(result, blocks_map):
    text = ''
    if 'Relationships' in result:
        for relationship in result['Relationships']:
            if relationship['Type'] == 'CHILD':
                for child_id in relationship['Ids']:
                    word = blocks_map[child_id]
                    if word['BlockType'] == 'WORD':
                        text += word['Text'] + ' '
                    if word['BlockType'] == 'SELECTION_ELEMENT':
                        if word['SelectionStatus'] =='SELECTED':
                            text +=  'X '    
    return text


def get_table_csv_results(file_name):

    with open(file_name, 'rb') as file:
        img_test = file.read()
        bytes_test = bytearray(img_test)
        #print('Image loaded', file_name)

    # process using image bytes
    # get the results
    client = boto3.client('textract')

    response = client.analyze_document(Document={'Bytes': bytes_test}, FeatureTypes=['TABLES'])

    # Get the text blocks
    blocks=response['Blocks']
    #pprint(blocks)

    blocks_map = {}
    table_blocks = []
    for block in blocks:
        blocks_map[block['Id']] = block
        if block['BlockType'] == "TABLE":
            table_blocks.append(block)

    if len(table_blocks) <= 0:
        return "<b> NO Table FOUND </b>"

    csv = ''
    for index, table in enumerate(table_blocks):
        csv += generate_table_csv(table, blocks_map, index +1)
        csv += '\n\n'

    return csv

def generate_table_csv(table_result, blocks_map, table_index):
    rows = get_rows_columns_map(table_result, blocks_map)

    table_id = 'Table_' + str(table_index)
    
    # get cells.
    csv = 'Table: {0}\n\n'.format(table_id)

    for row_index, cols in rows.items():
        
        for col_index, text in cols.items():
            csv += '{}'.format(text) + ","
        csv += '\n'
        
    csv += '\n\n\n'
    return csv
    
def csv_json(csv_output_file,json_output_file):
    file_name= csv_output_file
    rows=[]
    with open(file_name, 'r',encoding="utf8") as csvfile:        
        csvreader = csv.reader(csvfile) 

        # extracting field names through first row 
        fields = next(csvreader) 

        # extracting each data row one by one 
        for row in csvreader: 
            rows.append(row) 
            
    #removing empty lines
    temp_list = []
    
    for i in range(len(rows)):  
        #print("rows:",rows[i])
        if(len(rows[i])>=2):
            temp = []
            for j in range(len(rows[i])):
                if(len(rows[i][j])>1):
                    temp.append(rows[i][j].strip())
            #print("temp:",temp)
            temp_list.append(temp)
    
    master_list = []
    for i in range(len(temp_list)):
        if len(temp_list[i])>=2:
            master_list.append(temp_list[i])

            
        
    master_dict = {}
    for i in range(len(master_list)):  

        value = master_list[i][1]
        try:
            for j in master_list[i][2:]:
                value+= "," + j
            master_dict[master_list[i][0]] = value
        except:
            master_dict[master_list[i][0]] = value
        
    json_object = json.dumps(master_dict, indent = 4)
    json_final = json.loads(json_object)    
    with open(json_output_file,'w') as outfile:
        json.dump(json_final, outfile)
        
    #print(json_object)    
    return json_final


def core_file_name(file_path):
    # This function has been created to get the actaul name of the file
    # i.e irrespective of any file extensions(.pdf/.jpg etc.) and path extensions(//.../../)
    # E.G: from asdf//dsfdsf/xyz.pdf it will return xyz only 
    
    #CAUTION : VERY NOOB CODE :P
    
    #removing the extension 
    file_path = file_path[::-1]
    file_less_ext = file_path[file_path.index('.')+1:][::-1]
    
    #print(file_less_ext)
    
    #removing the path to get the actual name
    try:
        index = file_less_ext[::-1].index("/")    
        #path_index = file_less_ext[::-1].index("/")        
        temp_less_path = file_less_ext[::-1]        
        temp_less_path=temp_less_path[:temp_less_path.index('/')]
        final_name = temp_less_path[::-1]
        
    except:
        final_name = file_less_ext
        
    return final_name

def main(file_name):
    #print(file_name)
    output_file_name = core_file_name(file_name)
    #print(output_file_name)
    
    csv_output_file = output_file_name+'.csv'
    if(file_name[-3:]=="pdf"):
        extract_pdf(file_name,csv_output_file)
    
    else:
        extract_jpg(file_name,csv_output_file)
        
      
        
    json_output_file = output_file_name+'.json'    
    result = csv_json(csv_output_file,json_output_file)
    print(result)
    
    os.mkdir(output_file_name)
    shutil.move(csv_output_file,output_file_name+'/'+csv_output_file)
    shutil.move(json_output_file,output_file_name+'/'+json_output_file)
    
    
if __name__ == "__main__":    
    file_name = sys.argv[1]
    main(file_name)   
    
    

    
