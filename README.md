# aws.roman-kaspar.cz

Mini project to get familiar with AWS infrastructure, configuration, and DNS settings.

### THIS PROJECT IS NO LONGER MAINTAINED.

## About

I created this project when learning about and playing with AWS platform.

There are 3 main parts to the project:
* static content served via CloudFront service from S3 bucket,
* API service hosted on EC2, connected to PostgreSQL RDS, and
* API service hosted on Lambda, connected to DynamoDB.

The code is split into 3 directories following the 3 areas listed above.
As part of this exercise I also bought domain and configured CNAME records
pointing to domains of individual services provided by AWS.

You can visit the project at [http://aws.roman-kaspar.cz/](http://aws.roman-kaspar.cz/).
It runs completely on free-tier AWS machines / services, so the only associated cost is
the DNS name. Once the initial free 12-month period in AWS expires, I might
take the project down, adjust the deploymnet, or move it somewhere else,
but the code will still be here, so you can review and/or use for your project.

For the list of AWS resources used in the project and how they are glued together,
see the image and the legend on the main page of the project.

In case you want to deploy the `ec2` part, make sure to rename `dotenv` file
to `.env` and edit all the values there to match it with your own services
and resources. Also, go though all the files and replace the domain names
with your actual domain names.

The source code of the project image is in `project.xml` file and can be further
edited at [https://draw.io/](https://draw.io/).

## MIT License

Copyright (c) 2018 Roman Kaspar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
