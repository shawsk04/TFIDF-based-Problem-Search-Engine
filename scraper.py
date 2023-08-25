from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
import time

ser = Service('chromedriver.exe')  # Path to chromedriver executable
driver = webdriver.Chrome(service=ser)


urlsFilePath = ".\database\problem_urls.txt"
titlesFilePath = ".\database\problem_titles.txt"


# url list for leetcode probs

driver.get("https://leetcode.com/problemset/all/?page=1&topicSlugs=dynamic-programming")
time.sleep(2)
html = driver.page_source
soup = BeautifulSoup(html, "html.parser")

allTagsDiv = soup.findAll("div", {"class": "group m-[10px] flex items-center"})

allTagsAnchorTags = []
allTagsSpanTags = []

for tag in allTagsDiv:
    allTagsAnchorTags.append(tag.find("a"))

for tag in allTagsAnchorTags:
    allTagsSpanTags.append(tag.find("span"))

tagTitles = []
tagUrls = []

for tag in allTagsAnchorTags:
    tagUrls.append("https://leetcode.com" + tag['href'])

for tag in allTagsSpanTags:
    tagTitles.append(tag.text)


for i in range(len(tagTitles)):
    driver.get(tagUrls[i])
    time.sleep(10)
    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")
    allProbsDiv = soup.findAll("div", {"class": "title-cell__ZGos"})

    allProbsAnchorTags = []

    for prob in allProbsDiv:
        ProbsSpanTag = []
        ProbsSpanTag = prob.findAll("span")
        if len(ProbsSpanTag) > 0:
            continue
        allProbsAnchorTags.append(prob.find("a"))

    Q_Titles = []
    Q_urls = []

    count = 0
    for prob in allProbsAnchorTags:
        if(count >= 100):
            break
        Q_urls.append("https://leetcode.com" + prob['href'])
        Q_Titles.append(prob.text)
        count += 1

    with open(urlsFilePath, "a+") as f:
        f.write('\n'.join(Q_urls))
        f.write('\n')
    
    with open(titlesFilePath, "a+") as f:
        f.write('\n'.join(Q_Titles))
        f.write('\n')
    
    time.sleep(4);


# url list for CSES probs

driver.get("https://cses.fi/problemset/")
time.sleep(5)
html = driver.page_source
soup = BeautifulSoup(html, 'html.parser')

ques_table = soup.findAll("li", {"class": "task"})
urls = []
titles = []

for row in ques_table:
    anchor = row.find("a")
    titles.append(anchor.text)
    urls.append("https://cses.fi"+anchor['href'])


with open(urlsFilePath, "a+") as f:
    f.write('\n'.join(urls))

with open(titlesFilePath, "a+", encoding="utf-8") as f:
    f.write('\n'.join(titles))



#scraping the problem statements

allUrlsFile = open(urlsFilePath, "r")
content = allUrlsFile.read()
url_list = content.split("\n")
allUrlsFile.close()


# for leetcode problems

for cnt in range(0, 2985):
    driver.get(url_list[cnt])
    time.sleep(6)
    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")

    allPTags = soup.findAll("div", {"class": "content__u3I1 question-content__JfgR"})[0].findAll("p")

    allPTextContent = []
    fullProblemStatement = ""

    for tag in allPTags:
        if tag.text == "Example 1:":
            break
        fullProblemStatement = fullProblemStatement + tag.text

    with open(".database/problems/problem_text_"+str(cnt+1)+".txt", "w+", encoding="utf-8") as f:
        f.write(fullProblemStatement)


# for CSES questions

for cnt in range(2986, 3286):
    driver.get(url_list[cnt])
    time.sleep(5)
    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')
    problem = soup.find("div", {"class": "content"})

    txt = problem.text

    with open(".database/problems/problem_text_"+str(cnt)+".txt", "w+", encoding="utf-8") as f:
        f.write(txt)
    
    quesFile = open(".database/problems/problem_text_"+str(cnt)+".txt", "r")
    content = quesFile.read()
    line_list = content.split("\n")
    quesFile.close()
    txt = ""

    for line in line_list:
        if "Time limit:" in line : continue
        if "Memory limit:" in line : continue

        if line == "Input": break

        txt += line
        txt += " "

    with open(".database/problems/problem_text_"+str(cnt)+".txt", "w") as f:
        f.write(txt)
