<?php

namespace UPS\VCGBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class JobMapImportCommand extends ContainerAwareCommand
{
    const ARG_CSV = 'csv';
    
    
    private $output;
    
    
    protected function configure() {
        $this
            ->setName('ups:jobmap:import')
            ->setDescription('Read CSV data and generate job-map data files.')
            ->addArgument(
                self::ARG_CSV,
                InputArgument::REQUIRED,
                'Path to the CSV file.'
            )
        ;
    }
    
    
    protected function execute(InputInterface $input, OutputInterface $output) {
        if (! function_exists('json_encode')) {
            $output->writeln("\n<error> JSON extension is required </error>\n");
            return;
        }
        
        $csvPath = $input->getArgument(self::ARG_CSV);
        $this->output = $output;
        $this->import($csvPath);
    }
    
    
    private function export($csvData) {
        // group by state, then city
        $data = array();
        foreach ($csvData as $record) {
            $state = $record['state'];
            
            // create states sub-array if it doesn't exist
            if (! array_key_exists($state, $data)) {
                $data[$state] = array();
            }
            
            // write to city sub-sub-array
            $data[$state][$record['city']] []= $record;
        }
        
        // now for each state, encode records and generate file
        $basePath = 'web/js/job-map/';
        foreach ($data as $stateAbbr => $stateData) {
            $path = $basePath . $stateAbbr . '-data.json';
            $this->output->writeln("\t<comment>Writing ".count($stateData)." records for ".$stateAbbr."</comment>");
            $json = json_encode(
                $stateData,
                0,
                5
            );
            file_put_contents($path, $json);
        }
    }
    
    
    private function import($csvPath) {
        $this->output->writeln("<info>Reading CSV data from $csvPath</info>");
        $csvData = $this->readCSV($csvPath);
        
        $this->output->writeln("\n<info>Writing data files to web/js/job-map</info>");
        $this->export($csvData);
    }
    

    private function readCSV($csvPath) {
        // CSV fields:
        //      0   FAC_LOC_NR      (save as 'id')      Unique location name.
        //      1   FAC_NA          (save as 'name')    Facility name.
        //      2   STREET          (drop)
        //      3   CITY            (save as 'city')    City name.
        //      4   ST              (save as 'state')   State abbreviation.
        //      5   ZIP             (save as 'zip')     Zip-code.
        //      6   EE COUNT        (drop)
        //      7   Size            (save as 'size')    Facility size (Large or Medium)
        //      8   Available Jobs  (save as 'jobs')    Comma-separated list of job titles.
        //      9   Lat             (save as 'lat')     Location lattitude.
        //      10  Long            (save as 'lon')     Location longitude.
        //      11  JOBS            (drop)
        
        $handle = fopen($csvPath, 'r');
        $result = array();
        fgetcsv($handle, 0, ',', '"'); // skip header line, we don't need it
        while (($data = fgetcsv($handle, 0, ',', '"')) !== FALSE) {
            $size = trim($data[7]);
            $result []= array(
                'id'    => trim($data[0]),
                'name'  => $this->ucname(trim($data[1])),
                'city'  => $this->ucname(trim($data[3])),
                'state' => trim($data[4]),
                'zip'   => trim(strval($data[5])),
                'size'  => ($size == 'Large' ? 0 : ($size == 'Medium' ? 1 : 2)),
                'jobs'  => array_map('trim', preg_split('/,\s?/', $data[8])),
                'lat'   =>  floatval(trim($data[9])),
                'lon'   => floatval(trim($data[10]))
            );
        }
        fclose($handle);
        $this->output->writeln("\t<comment>Read ".count($result)." records</comment>");
        return $result;
    }
    
    
    private function ucname($str) {
        $result = ucwords(strtolower($str));
        foreach(array('(', ')', '/') as $delim) {
            if (strpos($result, $delim) !== FALSE) {
                $result = implode(
                    $delim,
                    array_map(
                        'ucfirst',
                        explode($delim, $result)
                    )
                );
            }
        }
        return $result;
    }

}
?>
